from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelsTestCase(TestCase):
    def setUp(self):
        team = Team.objects.create(name="Team A", description="Equipo de prueba")
        user = User.objects.create(name="Usuario Test", email="test@octofit.com", team=team)
        Activity.objects.create(user=user, type="run", distance=5.0, duration=30)
        Workout.objects.create(user=user, workout="pushups", reps=20)
        Leaderboard.objects.create(user=user, points=100, rank=1)

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)

    def test_team_creation(self):
        self.assertEqual(Team.objects.count(), 1)

    def test_activity_creation(self):
        self.assertEqual(Activity.objects.count(), 1)

    def test_workout_creation(self):
        self.assertEqual(Workout.objects.count(), 1)

    def test_leaderboard_creation(self):
        self.assertEqual(Leaderboard.objects.count(), 1)
