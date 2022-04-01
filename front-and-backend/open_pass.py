def get_pass():
    pass_file = open("db-pass.txt", 'r')
    db_pass = pass_file.read()
    pass_file.close()
    return db_pass