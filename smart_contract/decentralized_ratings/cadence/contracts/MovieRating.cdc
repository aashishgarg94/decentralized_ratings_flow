pub contract MovieRating {
    pub struct Movie {
        pub var ratings: {Address: UInt8}
        pub var totalRatings: UInt32
        pub var totalVotes: UInt32

        init() {
            self.ratings = {}
            self.totalRatings = 0
            self.totalVotes = 0
        }

        pub fun addRating(user: Address, rating: UInt8) {
            self.totalVotes = self.totalVotes + 1
            self.ratings[user] = rating
            self.totalRatings = self.totalRatings + UInt32(rating)
        }

        pub fun getAverageRating(): UInt8 {
            return UInt8(self.totalRatings / self.totalVotes)
        }
    }

    pub struct User {
        pub var ratedMovies: {String: Bool}

        init() {
            self.ratedMovies = {}
        }

        pub fun rateMovie(name: String) {
            self.ratedMovies[name] = true
        }

        pub fun hasRatedMovie(name: String): Bool {
            return self.ratedMovies[name] ?? false
        }
    }

    access(contract) var movies: {String: Movie}
    access(contract) var users: {Address: User}

    pub fun getMovies() : {String: Movie} {
        return self.movies;
    }

    pub fun getUsers(): {Address: User} {
        return self.users;
    }
    init() {
        self.movies = {}
        self.users = {}
    }

    pub fun addUser(user: Address) {
        self.users[user] = User()
    }

    pub fun addMovie(name: String) {
        self.movies[name] = Movie()
    }

    pub fun vote(user: Address, name: String, rating: UInt8) {
        if rating < 0 || rating > 10 {
            panic("Rating must be between 0 and 10")
        }

        self.movies[name]?.addRating(user: user, rating: rating);
        self.users[user]?.rateMovie(name: name);
    }
}