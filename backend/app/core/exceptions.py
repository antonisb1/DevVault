from fastapi import HTTPException, status



def bad_request(message: str, details: dict | None = None) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail={'code': 'bad_request', 'message': message, 'details': details or {}},
    )



def unauthorized(message: str = 'Authentication required') -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={'code': 'unauthorized', 'message': message},
    )



def forbidden(message: str = 'Access denied') -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail={'code': 'forbidden', 'message': message},
    )



def not_found(resource: str = 'Resource') -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={'code': 'not_found', 'message': f'{resource} not found'},
    )



def conflict(message: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail={'code': 'conflict', 'message': message},
    )
