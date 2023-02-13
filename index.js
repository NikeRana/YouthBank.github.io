var con = require("./connection");
var express = require("express");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get('/home.html',(req,res)=>{
     res.sendFile(__dirname+'/home.html')
});
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/home.html')
});

app.get('/about_us.html',(req,res)=>{
    res.sendFile(__dirname+'/about_us.html')
});

app.post('/send_money',(req,res)=>{
    var sender_no=req.body.sender_no;
    var amount=parseInt(req.body.amount);
    var receiver_no=req.body.receiver_no;
    var amount_data=0;


    con.connect((err)=>{
        if(err) console.log(err);
        
        var sql="SELECT * FROM customer WHERE accno = "+sender_no+"";
        

            con.query(sql,(error,result)=>{
            if(error) {
                console.log(error);
                res.send("Error! Invalid Data");
            };
        
            amount_data=result[0].bal;

                if(amount==0||amount_data<amount){    
                    console.log("Invalid input")             
                    res.render(__dirname+'/send_money',{money:'result',success:'',failed:'Opps! Invalid Input'})
                
                }
                else{

                    if(amount<amount_data){
                        var balance1 = amount_data-amount;
                        var sql1 = "UPDATE customer SET bal = "+balance1+" WHERE accno="+sender_no+""
                        con.query(sql1,(error,result)=>{    
                            if(error)  {
                                console.log(error);
                                var status = 'failed';
                                var sql3 = "INSERT INTO transaction(sender,receiver,amount,status) VALUES('"+0+"','"+0+"','"+amount+"','"+status+"') ";
                                con.query(sql3,(error,result)=>{
                                    if(error) console.log("error is here ",error);
                                    res.redirect('/transaction');
                                })
                            }
                                var status = 'success';
                                var sql3 = "INSERT INTO transaction(sender,receiver,amount,status) VALUES('"+sender_no+"','"+receiver_no+"','"+amount+"','"+status+"') "
                                con.query(sql3,(error,result)=>{
                                    if(error) console.log("error is here ",error);
                                    res.render(__dirname+'/send_money',{money:'result',tran:'',success:'Transfer money Successfully',failed:''})
                                   
                                    
                            })
                        })
                    }
                }
    })

         var sql1="SELECT * FROM customer WHERE accno = "+receiver_no+"";
        con.query(sql1,(error,result)=>{
            if(error) console.log(error)
            amount_data=result[0].bal;
            
                var balance = amount_data + amount;
                var sql1 = "UPDATE customer SET bal = "+balance+" WHERE accno="+receiver_no+""
                con.query(sql1,(error,result)=>{
                  if(error) console.log(error);
            
                })
            
        })
    })
})



app.get('/all_cust',(req,res)=>{
    con.connect((err)=>{
        if(err) console.log("Problem in connecting Database");
        con.query("select * from customer",(error,result)=>{
            if(error) throw error;
            res.render(__dirname+'/all_cust',{cust:result});

        });
    });
});

app.get('/transaction',(req,res)=>{
con.connect((error)=>{
    if(error) {console.log("your error in transactions :"+error);}
    con.query("select * from transaction ",(error,result)=>{
        if(error) throw error;
        res.render(__dirname+'/transaction',{tran:result});
    })
})
})


app.get('/send_money',(req,res)=>{
    if(req.query.send_no >0) {

        con.connect((error)=>{
            if(error) console.log(error);
            var sql = "select * from customer where accno=?";
            var sender_no = req.query.send_no;
            
            con.query(sql,[sender_no],(error,result)=>{
                if(error) console.log(error);
                res.render(__dirname+'/send_money',{money:result, success:"",failed:''});
            })
        })
    }
    else 
    con.query("select * from customer where accno=''",(error,result)=>{
        if(error) console.log(error);
        res.render(__dirname+'/send_money',{money:result,success:"",failed:''});
    })
})

app.get('/view_one',(req,res)=>{
   
       con.connect((error)=>{
            if(error) console.log(error);
            var sql = "select * from customer where accno=?";
            var detail= req.query.detail;
            
            con.query(sql,[detail],(error,result)=>{
                if(error) console.log(error);
                res.render(__dirname+'/view_one',{money:result,});
            })
        })
    
})



app.listen(3000);