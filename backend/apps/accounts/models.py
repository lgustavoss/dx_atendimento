from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    # Campos básicos
    email = models.EmailField(_('email'), unique=True)
    nome = models.CharField(_('nome'), max_length=255)
    
    # Permissões
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Indica se o usuário pode acessar o admin.'),
    )
    is_active = models.BooleanField(
        _('active'),
        default=True,
        help_text=_('Indica se este usuário deve ser tratado como ativo.'),
    )
    is_superuser = models.BooleanField(
        _('superuser status'),
        default=False,
        help_text=_('Indica se o usuário tem todas as permissões.'),
    )
    
    # Campos de status online
    is_online = models.BooleanField(
        _('online status'),
        default=False,
        help_text=_('Indica se o usuário está online.'),
    )
    last_activity = models.DateTimeField(
        _('última atividade'),
        null=True,
        blank=True,
        help_text=_('Última atividade registrada do usuário.'),
    )
    
    # Campos de auditoria
    created_at = models.DateTimeField(_('criado em'), auto_now_add=True)
    updated_at = models.DateTimeField(_('atualizado em'), auto_now=True)
    last_login = models.DateTimeField(_('último login'), null=True, blank=True)
    
    # Configurações
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')
        ordering = ['-created_at']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.nome

    def get_short_name(self):
        return self.nome.split()[0] if self.nome else self.email

    def update_last_activity(self):
        """Atualiza o timestamp da última atividade"""
        self.last_activity = timezone.now()
        self.save(update_fields=['last_activity'])

    def update_online_status(self, is_online: bool):
        """Atualiza o status online do usuário"""
        self.is_online = is_online
        if is_online:
            self.last_activity = timezone.now()
        self.save(update_fields=['is_online', 'last_activity'])
