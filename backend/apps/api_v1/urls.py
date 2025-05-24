from django.urls import path, include

urlpatterns = [
    path('accounts/', include('apps.accounts.urls')),
    path('companies/', include('apps.companies.urls')),
    path('groups/', include('apps.groups.urls')),
    path('contacts/', include('apps.contacts.urls')),
    path('chats/', include('apps.chats.urls')),
]