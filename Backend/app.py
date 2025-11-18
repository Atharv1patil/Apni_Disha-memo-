from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config.setting import Settings
from routes.chat import create_chat_blueprint
from routes.colleges import college_routes
from services.gemini_service import GeminiChatService
from routes.content import content_routes
from routes.degree import degree_routes
from routes.stream import stream_routes


def create_app() -> Flask:
    load_dotenv()

    app = Flask(__name__)

    # ------------------------------------------------------------
    # FIXED CORS – dynamic origin + credentials + full method list
    # ------------------------------------------------------------
    FRONTEND_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://10.208.230.231:5173",
        "http://localhost:3000",
    ]

    CORS(
        app,
        resources={r"/api/*": {"origins": FRONTEND_ORIGINS}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    @app.after_request
    def apply_cors(response):
        origin = request.headers.get("Origin")

        if origin in FRONTEND_ORIGINS:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = \
                "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = \
                "Content-Type, Authorization"

        return response
    # ------------------------------------------------------------

    # Load settings
    settings = Settings.from_env()

    chat_service = GeminiChatService(
        api_key=settings.GEMINI_API_KEY,
        model_name=settings.GEMINI_MODEL,
        system_prompt=settings.load_system_prompt(),
        generation_config=settings.gemini_generation_config()
    )

    # Register blueprints
    app.register_blueprint(create_chat_blueprint(chat_service), url_prefix="/api")
    app.register_blueprint(college_routes, url_prefix="/api")
    app.register_blueprint(content_routes, url_prefix="/api")
    app.register_blueprint(degree_routes, url_prefix="/api")
    app.register_blueprint(stream_routes, url_prefix="/api")

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


if __name__ == "__main__":
    app = create_app()
    host = os.getenv("FLASK_RUN_HOST", "0.0.0.0")
    port = int(os.getenv("FLASK_RUN_PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(host=host, port=port, debug=debug)
