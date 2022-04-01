from flask import jsonify, make_response
from app import request, SSHTunnelForwarder, pymysql

def login(ec2_dns, db_pass):
    username = request.json["username"]
    password = request.json["password"]

    get_login_query = "SELECT * FROM database1.users WHERE Username='" + username + "' AND Password='" + password + "';"

    with SSHTunnelForwarder(
            ec2_dns,
            ssh_username="ec2-user",
            ssh_pkey="project-db-keys.pem",
            remote_bind_address=("apprenticeship-project-database-1.ccmjfntxpuqd.eu-west-2.rds.amazonaws.com", 3306)
    ) as tunnel:
        tunnel.start()

        conn = pymysql.connect(
            user="admin",
            password=db_pass,
            host="localhost",
            port=tunnel.local_bind_port
        )

        try:
            with conn.cursor() as cur:
                # If the query is successful, a 1 will be returned.
                # If the query is unsuccessful, a 0 will be returned.
                response = cur.execute(get_login_query)
                if response == 1:
                    for row in cur:
                        user_type = row[1]
                else:
                    user_type = "invalid"

        finally:
            conn.close()
            tunnel.close()

    user_type_return = make_response(jsonify({"user_type": user_type}))
    user_type_return.headers["Content-Type"] = "application/json"
    return user_type_return
