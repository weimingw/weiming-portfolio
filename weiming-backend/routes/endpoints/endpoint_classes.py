
"""
The structure altogether looks like this:
    {
        path: String,
        methods: {
            post: {
                name: String,
                body: {
                    arg1: {
                        type: String,
                        optional: Bool,
                    }
                },
                params: {
                    arg1: {
                        type: String,
                        optional: Bool,
                    }
                }
            },
        }
    }
"""

GET = 'get'
POST = 'post'
PUT = 'put'
DELETE = 'delete'

STRING = 'string'
BOOLEAN = 'boolean'
NUMBER = 'number'
DATE = 'date'
JSON = 'json'
LIST = 'list'

class EndpointArgument:
    def __init__(self, type=STRING, optional=False):
        self.type = type
        self.optional = optional
        self.subargument = None

    def add_subarg(self, name, subarg):
        if not isinstance(subarg, EndpointArgument):
            raise ValueError('Should pass EndpointArgument to EndpointArgument subarg but is getting {} for {}'.format(type(subarg, name)))
        self.subargument_name = name
        self.subargument = subarg
        return self

class EndpointMethod:
    def __init__(self, name='', need_session=True):
        self.body = {}
        self.params = {}
        self.name = name
        self.need_session = True

    def add_body_arg(self, name, arg):
        if not isinstance(arg, EndpointArgument):
            raise ValueError('Should add EndpointArgument to EndpointMethod but is getting {} for {}'.format(type(arg), name))

        self.body[name] = arg
        return self

    def add_param_arg(self, name, arg):
        if not isinstance(arg, EndpointArgument):
            raise ValueError('Should add EndpointArgument to EndpointMethod but is getting {} for {}'.format(type(arg), name))

        self.params[name] = arg
        return self

class Endpoint:
    def __init__(self, path=''):
        self.path = path
        self.methods = {}

    def add_method(self, method, metadata):
        if not isinstance(metadata, EndpointMethod):
            raise ValueError('Should add EndpointMethod to Endpoint but is getting {} for {}'.format(type(metadata), method))

        self.methods[method] = metadata
        return self
