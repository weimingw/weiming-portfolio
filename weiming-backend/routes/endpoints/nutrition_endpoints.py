from routes.endpoints.endpoint_classes import *

NUTRITION_DAY_EP = Endpoint('/nutrition/days') \
    .add_method(GET, 
        EndpointMethod(name='get all days with nutrition data or get a speciic day with nutritional data') \
            .add_param_arg('date', EndpointArgument(DATE, optional=True))
    ) \
    .add_method(POST,
        EndpointMethod(name='create day with nutrition data') \
            .add_body_arg('date', EndpointArgument(DATE))
            .add_body_arg('entries', EndpointArgument(LIST) \
                .add_subarg('0', EndpointArgument(JSON) \
                    .add_subarg('ndbno', EndpointArgument(NUMBER)) \
                    .add_subarg('amount', EndpointArgument(NUMBER) ) \
                    .add_subarg('unit', EndpointArgument(STRING))))
    ) \
    .add_method(PUT,
        EndpointMethod(name='edit day with nutrition data') \
            .add_body_arg('date', EndpointArgument(DATE))
            .add_body_arg('entries', EndpointArgument(LIST, optional=True) \
                .add_subarg('0', EndpointArgument(JSON, optional=True) \
                    .add_subarg('ndbno', EndpointArgument(NUMBER)) \
                    .add_subarg('amount', EndpointArgument(NUMBER)) \
                    .add_subarg('unit', EndpointArgument(STRING)) \
                    .add_subarg('label', EndpointArgument(STRING))))
    ) \
    .add_method(DELETE,
        EndpointMethod(name='delete day with nutrition data') \
            .add_body_arg('date', EndpointArgument(DATE))
    )