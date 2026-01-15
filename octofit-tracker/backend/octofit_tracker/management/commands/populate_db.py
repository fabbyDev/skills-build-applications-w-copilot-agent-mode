from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import connection
from djongo import models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Eliminando datos existentes...'))
        db = connection.cursor().db_conn
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        self.stdout.write(self.style.SUCCESS('Insertando datos de prueba...'))
        # Equipos
        marvel_id = db.teams.insert_one({"name": "Marvel", "description": "Equipo Marvel"}).inserted_id
        dc_id = db.teams.insert_one({"name": "DC", "description": "Equipo DC"}).inserted_id

        # Usuarios
        users = [
            {"name": "Iron Man", "email": "ironman@marvel.com", "team_id": marvel_id},
            {"name": "Spider-Man", "email": "spiderman@marvel.com", "team_id": marvel_id},
            {"name": "Batman", "email": "batman@dc.com", "team_id": dc_id},
            {"name": "Wonder Woman", "email": "wonderwoman@dc.com", "team_id": dc_id},
        ]
        db.users.insert_many(users)

        # Actividades
        activities = [
            {"user_email": "ironman@marvel.com", "type": "run", "distance": 5, "duration": 30},
            {"user_email": "spiderman@marvel.com", "type": "cycle", "distance": 10, "duration": 40},
            {"user_email": "batman@dc.com", "type": "swim", "distance": 2, "duration": 25},
            {"user_email": "wonderwoman@dc.com", "type": "run", "distance": 8, "duration": 35},
        ]
        db.activities.insert_many(activities)

        # Workouts
        workouts = [
            {"user_email": "ironman@marvel.com", "workout": "Pushups", "reps": 50},
            {"user_email": "spiderman@marvel.com", "workout": "Pullups", "reps": 20},
            {"user_email": "batman@dc.com", "workout": "Squats", "reps": 100},
            {"user_email": "wonderwoman@dc.com", "workout": "Lunges", "reps": 60},
        ]
        db.workouts.insert_many(workouts)

        # Leaderboard
        leaderboard = [
            {"user_email": "ironman@marvel.com", "points": 100},
            {"user_email": "spiderman@marvel.com", "points": 90},
            {"user_email": "batman@dc.com", "points": 95},
            {"user_email": "wonderwoman@dc.com", "points": 98},
        ]
        db.leaderboard.insert_many(leaderboard)

        # Índice único en email
        db.users.create_index([("email", 1)], unique=True)

        self.stdout.write(self.style.SUCCESS('¡Base de datos poblada con datos de prueba!'))
