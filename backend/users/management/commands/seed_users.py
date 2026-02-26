from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Poblar base de datos con usuarios de prueba.'

    def handle(self, *args, **kwargs):
        users_data = [
            {
                'email': 'admin@securitycast.com',
                'full_name': 'Administrador Principal',
                'password': 'AdminPassword123!',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'email': 'juan.perez@test.com',
                'full_name': 'Juan Pérez',
                'password': 'UserPassword123!',
                'is_staff': False,
                'is_superuser': False,
            },
            {
                'email': 'maria.gomez@test.com',
                'full_name': 'María Gómez',
                'password': 'UserPassword123!',
                'is_staff': False,
                'is_superuser': False,
            }
        ]

        for user_data in users_data:
            email = user_data['email']
            if not User.objects.filter(email=email).exists():
                User.objects.create_user(**user_data)
                self.stdout.write(self.style.SUCCESS(f'Usuario creado: {email}'))
            else:
                self.stdout.write(self.style.WARNING(f'El usuario ya existe: {email}'))
                
        self.stdout.write(self.style.SUCCESS('Proceso de población completado exitosamente.'))