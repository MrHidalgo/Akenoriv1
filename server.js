var	express	    =	require('express'),
    app         =	express();

app.set('port',	(process.env.PORT	||	44444));


// MAIN PAGE
app.use('/',	        express.static('./dist/', {
        'index' : 'index.html'
}));


app.listen(app.get('port'),	function()	{
    console.log('Server	started:	http://localhost:'	+	app.get('port')	+	'/');
});