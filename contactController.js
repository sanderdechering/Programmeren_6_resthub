// contactController.js
// Import contact model
Contact = require('./contactModel');
// Handle index actions
exports.index = function (req, res) {
    console.log('index');
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        let returnContacts = [];
        contacts.forEach(function(element){
            //strips all the mongoose out of de film models
            let newContact = element.toJSON();
            newContact._links = {};
            newContact._links.self = {href : 'http://' + req.headers.host + '/api/contacts/' + newContact._id}
            newContact._links.collection = {href : 'http://' + req.headers.host + '/api/contacts/'};
            returnContacts.push(newContact);
        });
        res.set('Access-Control-Allow-Origin', '*').json({
            items: returnContacts,
            _links: {
                self : {
                    href :  'http://' + req.headers.host + '/api/contacts/'
                }
            },
            pagination: "no"
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    console.log('new');
    if (!req.body.name || !req.body.email) {
        res.status(400).send('error 400, geen data in een van velden')
    }else{
        var contact = new Contact();
        contact.name = req.body.name ? req.body.name : contact.name;
        contact.gender = req.body.gender;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        // save the contact and check for errors
        contact.save(function (err) {
            if (err){
                res.json(err);
                return
            }
            res.set('Access-Control-Allow-Origin', '*').status(201).json({
                message: 'New contact created!',
                items: contact
            });
        });
    }
};

// Handle view contact info
exports.view = function (req, res) {
    console.log('view');
    console.log(req.params.contact_id);
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (contact === null){
            res.status(404).json({
                message: 'Cannot found item'
            })
            return;
        }
        if (err){
            res.send(err);
            return
        }
        res.set('Access-Control-Allow-Origin', '*').json({
            _id: contact._id,
            name: contact.name,
            gender: contact.gender,
            email: contact.email,
            phone: contact.phone,
            _links: {
                self : {
                    href :  'http://' + req.headers.host + '/api/contacts/' + contact._id
                },
                collection : {
                    href :  'http://' + req.headers.host + '/api/contacts/'
                }
            }
        });
    });
};
// Handle update contact info
exports.update = function (req, res) {
    console.log('update');
    if (!req.body.name || !req.body.email) {
        res.status(400).send('error 400, geen data in een van velden')
    }else{
        Contact.findById(req.params.contact_id, function (err, contact) {
            if (err){
                res.send(err);
                return
            }
            contact.name = req.body.name ? req.body.name : contact.name;
            contact.gender = req.body.gender;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            // save the contact and check for errors
            contact.save(function () {
                res.status(201).json({
                    message: 'Contact Info updated',
                    items: contact
                });
            });
        });
    }

};
exports.options = function(req, res){
    res.header('Allow', 'GET, POST, OPTIONS')
    res.set('Accept', 'application/json')
    res.set('*', 'Access-Control-Allow-Origin')
    res.status(200);
}

exports.optionsDetails = function(req, res){
    res.header('Allow', 'GET, DELETE, PATCH, PUT, OPTIONS')
    res.set('Accept', 'application/json')
    res.set('*', 'Access-Control-Allow-Origin')
    res.status(200)
}
// Handle delete contact
exports.delete = function (req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err){
            res.send(err);
        }
        res.status(204).json({
            message: 'removed'
        })
    });

};

