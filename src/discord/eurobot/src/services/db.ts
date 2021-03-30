import * as mysql from "mysql";

export class DBFactory {

    private static instance:DBFactory;

    private Pool:mysql.Pool;

    // private GetConnection:Function;

    constructor() {
        
        this.Pool = mysql.createPool({
            user:process.env.EUROBOT_DB_USERNAME,
            password:process.env.EUROBOT_DB_PASSWD,
            database:process.env.EUROBOT_DB,
            host:'localhost',
            multipleStatements: true,
            charset:'utf8mb4'
        });

        this.Pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err)
            process.exit(-1)
        });

    }

    private getPoolConnection() : Promise<mysql.PoolConnection> {

        let that = this;
        return new Promise(function(resolve,reject) {

            that.Pool.getConnection(function(error:mysql.MysqlError, connection:any) {
                
                if(error) {
                
                    reject(error);
                
                } else {
                
                    resolve(connection);
                
                }
            
            });

        });

    }

    static getInstance() {
        
        if (!DBFactory.instance) {
            DBFactory.instance = new DBFactory();
        }
        return DBFactory.instance;

    }

    public getConnectionQuery(connection:mysql.PoolConnection,sql:string,vals:any[]):Promise<any>{

        return new Promise(function(resolve,reject) {

            connection.query(sql,vals,(error, results)=>{

                if(error) {
                    
                    reject(error);
                
                } else {

                    connection.release();

                    resolve(results);
                
                }

            });

        });

    }

    // Execute MySQL query
	public async q(sql:string,vals:any[]) {

        if(this.Pool) {
            
            const connection = await this.getPoolConnection().catch(e=>{throw e});

            return await this.getConnectionQuery(connection,sql,vals);

        } else {

            throw "Pool Errpr";

        }

	}

    where(arr:Array<string>){

        let rtn = "";
        
        for(let i=0;i<arr.length;i++){
            if (i === 0) {
                rtn += "WHERE " + arr[i];
            } else {
                rtn += " AND " + arr[i];
            }
        }
        
        return rtn;

    }

}

export const db = DBFactory.getInstance();