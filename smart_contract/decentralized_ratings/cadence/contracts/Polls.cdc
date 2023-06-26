pub struct Polls {
    pub struct Poll {
        pub var poll_id: String
        pub var total_encrypted_votes: UInt32
        pub var total_decrypted_votes: UInt32
        pub var average_rating: UInt8
        pub var status: String
        pub var voting_deadline: UInt64
        pub var max_options: UInt8
        pub var result: UInt8?
        pub var public_key: String?
        pub var secret_key: String?

        init() {
            poll_id = ""
            total_encrypted_votes = 0
            total_decrypted_votes = 0
            average_rating = 0
            status = ""
            voting_deadline = 0
            max_options = 0
            result = nil
            public_key = nil
            secret_key = nil
        }
    }

    pub struct Vote {
        pub var poll_id: String
        pub var encrypted_vote: String
        pub var decrypted_vote: UInt8?

        init() {
            poll_id = ""
            encrypted_vote = ""
            decrypted_vote = nil
        }
    }

    pub struct Stake {
        pub var poll_id: String
        pub var staked_amount: UInt64
        pub var range_begin: UInt8
        pub var range_end: UInt8

        init(){
            poll_id = ""
            staked_amount = 0
            range_begin = 0
            range_end = 0
        }
    }

    access(contract) var polls: {String: Poll}
    access(contract) var votes: {String: Vote}
    access(contract) var stakes: {String: Stake}

    init() {
        self.polls = {}
        self.votes = {}
        self.stakes = {}
    }
}