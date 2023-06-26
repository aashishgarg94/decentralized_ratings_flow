import MovieRating from 0x01

transaction {
    let userAddress: Address
    let movieName: String
    let rating: UInt8

    prepare(signer: AuthAccount) {
        // Initialize some values for demonstration purposes.
        self.userAddress = signer.address
        self.movieName = "MovieName"
        self.rating = 8

        // Call addUser() function to add new user.
        MovieRating.addUser(user: self.userAddress)

        // Call addMovie() function to add new movie.
        MovieRating.addMovie(name: self.movieName)

        MovieRating.vote(user: self.userAddress, name: self.movieName, rating: self.rating)

    }

    execute {
        log(MovieRating.getMovies())
        log(MovieRating.getUsers())
    }
}