# llm_integration.py
import requests
import json

class GroqLLM:
    """
    Classe para integração com Groq API (LLM gratuito e rápido).
    Permite gerar respostas inteligentes com alta velocidade.
    """
    
    def __init__(self, api_key=None, model="llama3-8b-8192"):
        """
        Inicializa o LLM via Groq API.
        
        Args:
            api_key: API key do Groq (obter em https://console.groq.com)
            model: Modelo a usar (default: llama3-8b-8192)
        """
        self.api_key = api_key or os.environ.get("GROQ_API_KEY")
        self.model = model
        self.base_url = "https://api.groq.com/openai/v1"
        
        if not self.api_key:
            print("[Groq] Aviso: API key não fornecida. Configure GROQ_API_KEY ou forneça a key.")
            self.available = False
        else:
            self.available = True
            print(f"[Groq] Disponível com modelo: {model}")
    
    def generate_response(self, prompt, context="", system_prompt=""):
        """
        Gera resposta usando Groq API.
        
        Args:
            prompt: Pergunta ou texto do usuário
            context: Contexto adicional (opcional)
            system_prompt: Instrução de sistema para o LLM
            
        Returns:
            str: Resposta gerada pelo LLM ou mensagem de erro
        """
        if not self.available:
            return "[Groq indisponível] Configure GROQ_API_KEY para usar respostas inteligentes."
        
        try:
            # Construir messages
            messages = []
            
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            if context:
                messages.append({
                    "role": "system", 
                    "content": f"Contexto: {context}"
                })
            
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Enviar para Groq API
            response = requests.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": 0.7,
                    "max_tokens": 500,
                    "top_p": 0.9
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                response_text = result['choices'][0]['message']['content'].strip()
                
                if response_text:
                    print(f"[Groq] Resposta gerada: {response_text[:50]}...")
                    return response_text
                else:
                    return "O modelo gerou uma resposta vazia. Tente novamente."
            else:
                error_msg = response.json().get('error', {}).get('message', 'Erro desconhecido')
                return f"Erro na API Groq: {error_msg}"
                
        except requests.exceptions.Timeout:
            return "Erro: A API demorou muito para responder. Tente novamente."
        except requests.exceptions.ConnectionError:
            return "Erro: Não foi possível conectar à API Groq. Verifique sua conexão."
        except Exception as e:
            print(f"[Groq] Erro ao gerar resposta: {e}")
            return f"Erro ao processar: {str(e)}"


class LocalLLM:
    """
    Classe para integração com LLM local via Ollama.
    Mantida para uso futuro quando Ollama estiver instalado.
    """
    
    def __init__(self, model="llama3:8b", base_url="http://localhost:11434"):
        """
        Inicializa o LLM local via Ollama.
        
        Args:
            model: Nome do modelo Ollama (default: llama3:8b)
            base_url: URL da API Ollama (default: http://localhost:11434)
        """
        self.model = model
        self.base_url = base_url
        self.available = self.check_availability()
        
        if self.available:
            print(f"[Ollama] Disponível com modelo: {model}")
        else:
            print(f"[Ollama] Aviso: Ollama não está disponível.")
    
    def check_availability(self):
        """Verifica se Ollama está rodando."""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=2)
            return response.status_code == 200
        except Exception as e:
            return False
    
    def generate_response(self, prompt, context="", system_prompt=""):
        """Gera resposta usando LLM local."""
        if not self.available:
            return "[Ollama indisponível] O sistema funcionará em modo eco."
        
        try:
            full_prompt = f"{system_prompt}\n\n" if system_prompt else ""
            full_prompt += f"Contexto: {context}\n\n" if context else ""
            full_prompt += f"Pergunta: {prompt}\n\nResponda em português."
            
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {"temperature": 0.7, "max_tokens": 500}
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get('response', '').strip()
            else:
                return f"Erro na API Ollama: {response.status_code}"
                
        except Exception as e:
            return f"Erro ao processar: {str(e)}"


# Função factory para escolher o LLM
def get_llm(use="groq", **kwargs):
    """
    Retorna instância do LLM apropriado.
    
    Args:
        use: "groq" para API, "ollama" para local
        **kwargs: Argumentos específicos do LLM
        
    Returns:
        Instância do LLM escolhido
    """
    if use == "groq":
        return GroqLLM(**kwargs)
    elif use == "ollama":
        return LocalLLM(**kwargs)
    else:
        raise ValueError(f"LLM '{use}' não suportado. Use 'groq' ou 'ollama'.")