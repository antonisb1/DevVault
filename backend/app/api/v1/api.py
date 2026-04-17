from fastapi import APIRouter

from app.api.v1.routers import auth, dashboard, job_applications, learning_resources, notes, projects, saved_links, subscriptions, tags, users

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(dashboard.router)
api_router.include_router(job_applications.router)
api_router.include_router(learning_resources.router)
api_router.include_router(projects.router)
api_router.include_router(subscriptions.router)
api_router.include_router(notes.router)
api_router.include_router(saved_links.router)
api_router.include_router(tags.router)
