const accountDb = require('../../data/dbConfig.js')

module.exports = {
    validateId: (req, res, next) => {
        const accountId = req.params.id

        accountDb('accounts')
        .select('*')
        .where({ id: accountId })
        .first()
        .then(account => {
            if(account){
                req.account = account
                next()
            } else {
                res.status(404).json({ message: 'Unable to find account'})
            } 
        })
        .catch(err => {
            res.status(500).json({ message: 'Server was unable to retrieve account', err })
        })
    },

    validateAccount: (req, res, next) => {
        const { name, budget } = req.body

        if(!name){
            res.status(400).json({ message: 'Please add a Name' })
        } else if(!budget){
            res.status(400).json({ message: 'Please add a budget' })
        } else {
            next()
        }
    }
}