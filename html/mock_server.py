from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import base64
import gzip
import secrets
import time
from datetime import datetime

class MockHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        # Identifica para onde o Nelson está enviando os dados
        path = self.path 

        try:
            payload = json.loads(post_data)
            
            # --- ROTA DA CAIXA-PRETA (LOGS) ---
            if path == '/Log':
                with open("caixa_preta_001.log", "a") as f:
                    agora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    modulo = payload.get('modulo', 'UNKNOWN')
                    msg = payload.get('msg', 'Sem mensagem')
                    f.write(f"[{agora}] [AUDITORIA] Módulo: {modulo} | Erro: {msg}\n")
                
                print(f"[CAIXA-PRETA] Novo log registrado com sucesso.")
                response_data = {"status": 200, "msg": "Log arquivado"}

            # --- ROTA DE LOGIN ---
            elif path == '/Login':
                time.sleep(1.5) # Delay de teste
                pp_base64 = payload.get('pp')
                
                # Decodifica e Descomprime
                compressed_bytes = base64.b64decode(pp_base64)
                decompressed_json = gzip.decompress(compressed_bytes).decode('utf-8')
                dados_reais = json.loads(decompressed_json)
                
                print(f"[DATA] Tentativa de Login: {dados_reais.get('email')}")

                token_final = secrets.token_hex(32) 
                response_data = {
                    "status": 200,
                    "msg": "Autenticação OK",
                    "token": token_final, 
                    "user": {"id": 1001, "nome": "Nelson", "empresa": "Global XML"}
                }
            
            else:
                response_data = {"status": 404, "msg": "Rota não encontrada"}

        except Exception as e:
            print(f"[CRITICAL ERROR]: {e}")
            response_data = {"status": 500, "msg": "Falha no processamento do pacote"}

        # Resposta padrão para o React
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

print("------------------------------------------")
print("  SERVIDOR MOCK 001 - CAIXA-PRETA ATIVA")
print("  ESCUTANDO NA PORTA 3000")
print("------------------------------------------")
HTTPServer(('localhost', 3000), MockHandler).serve_forever()