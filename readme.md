# Express Coding Challenge

To set up the demo, add the following to mongo:

$ mongo dancockatiel

db.institutions.remove({})
db.books.remove({})
db.users.remove({})
db.institutions.insert(
    {
        _id: ObjectId("5be203032f47809e3d9dcdf4"),
        name:"Danstitution",
        url:"dandart.co.uk",
        "domain":"dandart.co.uk"
    }
);
db.books.insert(
    {
        _id: ObjectId("5be203032f47809e3847cdf4"),
        isbn: '9780140903799',
        title: 'Zen and the Magic of Roundabout maintenance : a brief history of time (for bed)',
        author: 'Roger Planer',
        institutions: [
            ObjectId("5be203032f47809e3d9dcdf4")
        ]
    }
)

To run the demo, install using `npm install` and `npm start`.

To run tests, `npm test`.