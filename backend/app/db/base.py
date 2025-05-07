# Importar e exportar Base
from app.db.session import Base

# Importar todos os modelos aqui
from app.models.user import User
from app.models.empresa import Empresa
from app.models.grupo import Grupo
from app.models.contato import Contato
from app.models.mensagem import Mensagem
from app.models.atendimento import Atendimento 