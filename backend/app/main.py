from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version='1.0.0',
    openapi_url=f'{settings.API_V1_STR}/openapi.json',
    docs_url='/docs',
    redoc_url='/redoc',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content={'error': exc.detail})
    return JSONResponse(status_code=exc.status_code, content={'error': {'code': 'http_error', 'message': str(exc.detail)}})


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_: Request, exc: RequestValidationError):
    details: dict[str, list[str]] = {}
    for error in exc.errors():
        field = '.'.join(str(part) for part in error.get('loc', []) if part != 'body') or 'body'
        details.setdefault(field, []).append(error.get('msg', 'Invalid value'))
    return JSONResponse(
        status_code=422,
        content={
            'error': {
                'code': 'validation_error',
                'message': 'Invalid request data',
                'details': details,
            }
        },
    )


@app.get('/health')
def health():
    return {'status': 'ok'}


app.include_router(api_router, prefix=settings.API_V1_STR)
