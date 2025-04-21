import logging
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db() -> None:
    db = SessionLocal()
    try:
        # Verifica se já existe um usuário admin
        user = db.query(User).filter(User.email == "admin@example.com").first()
        if not user:
            user = User(
                email="admin@example.com",
                nome="Administrador",
                hashed_password=get_password_hash("admin"),
                is_superuser=True,
            )
            db.add(user)
            db.commit()
            logger.info("Usuário admin criado com sucesso")
        else:
            logger.info("O usuário admin já existe")
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Criando usuário admin inicial")
    init_db()
    logger.info("Usuário inicial criado")
