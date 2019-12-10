const express = require('express')

const accountDb = require('../../data/dbConfig.js')
const { validateId, validateAccount } = require('./accountsMiddleware.js')

const router = express.Router()

router.get('/', (req, res) => {
    accountDb('accounts')
        .select('*')
        .limit(5)
        .orderBy('id', 'desc')
        .then(accounts => {
            res.status(200).json(accounts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Server was unable to retrieve accounts' })
        })
})

router.get('/:id', (req, res) => {
    const accountId = req.params.id

    accountDb('accounts')
        .select('*')
        .where({ id: accountId })
        .first()
        .then(account => {
            if (account) {
                res.status(200).json(account)
            } else {
                res.status(400).json({ message: 'Unable to find account' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Server was unable to retrieve account' })
        })
})

router.post('/', validateAccount, (req, res) => {
    const newAccount = req.body

    accountDb('accounts')
        .insert(newAccount, 'id')
        .then(id => {
            const accountId = id[0]
            return accountDb('accounts')
                .select('*')
                .where({ id: accountId })
                .first()
                .then(account => {
                    res.status(201).json(account)
                })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Server was unable to create account' })
        })
})

router.put('/:id', validateId, (req, res) => {
    const accountId = req.params.id
    const changes = req.body
    const { name, budget } = req.body

    if (!name && !budget) {
        res.status(400).json({ message: 'Please add changes' })
    } else {
        accountDb('accounts')
            .where({ id: accountId })
            .update(changes)
            .then(count => {
                res.status(200).json({ message: `${count} account(s) were updated` })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ message: 'Server was unable to update account(s)' })
            })
    }
})

router.delete('/:id', validateId, (req, res) => {
    const accountId = req.params.id

    accountDb('accounts')
        .where({ id: accountId })
        .del()
        .then(count => {
            res.status(200).json({ message: `${count} account(s) were deleted`, account: req.account.name })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: 'Server was unable to delete account' })
        })
})
module.exports = router