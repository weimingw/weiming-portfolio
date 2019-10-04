import sys
from os import listdir
from os.path import isfile, join
import argparse
from peewee_migrate import Router
sys.path.append('./')

from config.database import db

router = Router(db)
# get the migration that database is at
migration_num = db.execute_sql('select * from migratehistory').rowcount

parser = argparse.ArgumentParser(description='Rolls back migrations')
# looks for --n argument
parser.add_argument('-n', type=int, help='number of migrations to roll back')

args = parser.parse_args()
n = min(args.n if args.n != None else 1, migration_num)     # default to 1

# list of all files in migrations folder
migration_files = [f for f in listdir('./migrations') if isfile(join('./migrations', f))]

# loop until we reach n number of rollbacks
while n > 0:
    file_name = migration_files[migration_num - 1].split('.')[0]
    router.rollback(file_name)
    
    migration_num -= 1
    n -= 1