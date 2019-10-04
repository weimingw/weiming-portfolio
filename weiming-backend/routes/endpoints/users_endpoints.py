from routes.endpoints.endpoint_classes import *

USER_EP = Endpoint(path='/user')\
    .add_method(POST, 
        EndpointMethod(name='create user', need_session=False) \
            .add_body_arg('name', EndpointArgument(STRING)) \
            .add_body_arg('email', EndpointArgument(STRING)) \
            .add_body_arg('password', EndpointArgument(STRING)) \
            .add_body_arg('password_confirmation', EndpointArgument(STRING)) \
            .add_body_arg('origin', EndpointArgument(STRING))
    ) \
    .add_method(PUT, 
        EndpointMethod(name='update user')\
            .add_body_arg('new_name', EndpointArgument(STRING, optional=True))\
            .add_body_arg('new_email', EndpointArgument(STRING, optional=True))\
            .add_body_arg('new_password', EndpointArgument(STRING, optional=True))\
            .add_body_arg('new_password_confirmation', EndpointArgument(STRING, optional=True))
    )

LOGIN_EP = Endpoint(path='/user/login')\
    .add_method(POST, 
        EndpointMethod(name='login', need_session=False) \
            .add_body_arg('email', EndpointArgument(STRING)) \
            .add_body_arg('password', EndpointArgument(STRING)) \
    )

LOGOUT_EP = Endpoint(path='/user/logout')\
    .add_method(DELETE, 
        EndpointMethod(name='logout', need_session=True))

VERIFY_SESSION_EP = Endpoint(path='/user/verify_session')\
    .add_method(POST, 
        EndpointMethod(name='login', need_session=False))

VERIFY_USER_EP = Endpoint(path='/user/verify')\
    .add_method(GET, 
        EndpointMethod(name='logout', need_session=True) \
            .add_param_arg('c', EndpointArgument(STRING)) \
            .add_param_arg('i', EndpointArgument(STRING))
    )