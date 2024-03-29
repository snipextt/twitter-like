const { admin, db} = require('../server/admin');

module.exports = (req,res,next) => {
    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else {
     return res.status(403).json({error: 'Unauthorized'})
    }
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken => {
      console.log(decodedToken);
      req.user = decodedToken;
      return db.collection('users')
      .where('userId','==',req.user.uid)
      .limit(1)
      .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().userHandle;
      req.user.profileImg = data.docs[0].data().profileImg;
      return next();
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json(err)
    })
  }