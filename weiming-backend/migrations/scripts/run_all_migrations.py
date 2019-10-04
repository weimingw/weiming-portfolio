import sys
sys.path.append('./')

from peewee_migrate import Router
from playhouse.db_url import connect

from constants.secrets import DATABASE_URI

db = connect(DATABASE_URI)

router = Router(db)

# Run unapplied /migrations
router.run()