from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import base64
import gzip
import secrets
import time

class MockHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        # Delay proposital para testar o 'Loading' do Nelson
        time.sleep(1.5)

        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        token_recebido = self.headers.get('Authorization')
        print(f"\n[SECURITY] Token na Requisição: {token_recebido}")

        try:
            payload = json.loads(post_data)
            pp_base64 = payload.get('pp')
            
            # Decodifica e Descomprime
            compressed_bytes = base64.b64decode(pp_base64)
            decompressed_json = gzip.decompress(compressed_bytes).decode('utf-8')
            dados_reais = json.loads(decompressed_json)
            
            print(f"[DATA] Login para: {dados_reais.get('email')}")

            # GERAÇÃO DO TOKEN DINÂMICO REAL
            token_final = secrets.token_hex(32) 

            response_data = {
                "status": 200,
                "msg": "Autenticação realizada com sucesso!",
                "token": token_final, 
                "user": {
                    "id": 1001,
                    "nome": "Nelson",
                    "empresa": "Global XML Enterprise"
                }
            }
        except Exception as e:
            print(f"[ERROR]: {e}")
            response_data = {"status": 500, "msg": "Erro de descompressão"}

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

print("------------------------------------------")
print("  SERVIDOR MOCK 001 - PORTA 3000")
print("------------------------------------------")
HTTPServer(('localhost', 3000), MockHandler).serve_forever()