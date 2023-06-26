pub contract Polls {
    pub struct Poll {
        pub var poll_id: String
        pub var total_votes: UInt32
        pub var status: String
        pub var voting_deadline: UInt64
        pub var max_options: UInt8
        pub var public_key: String
        pub var result: UInt8?
        pub var secret_key: String?

        init(poll_id: String, voting_deadline: UInt64, max_options: UInt8, public_key: String) {
            self.poll_id = poll_id
            self.total_votes = 0
            self.status = "active"
            self.voting_deadline = voting_deadline
            self.max_options = max_options
            self.public_key = public_key
            self.result = nil
            self.secret_key = nil
        }

        pub fun is_active(): Bool {
            return self.status == "active"
        }

        pub fun is_cancelled(): Bool {
            return self.status == "cancelled"
        }

        pub fun is_ended(): Bool {
            return self.status == "ended"
        }

        pub fun is_revealed(): Bool {
            return self.status == "revealed"
        }

        pub fun cancel_poll() {
            self.status = "cancelled"
        }

        pub fun end_poll() {
            self.status = "ended"
        }

        pub fun add_vote() {
            self.total_votes = self.total_votes + 1
        }

        pub fun reveal_poll(result: UInt8, secret_key: String) {
            self.status = "revealed"
            self.result = result
            self.secret_key = secret_key
        }
    }

    pub struct Content {
        pub var title: String
        pub var total_revealed_votes: UInt32
        pub var total_revealed_rating: UInt64

        init(title: String) {
            self.title = title
            self.total_revealed_votes = 0
            self.total_revealed_rating = 0
        }

        pub fun update_cumulative_ratings(cumulative_rating: UInt64, votes_added: UInt32) {
            self.total_revealed_votes = self.total_revealed_votes + votes_added
            self.total_revealed_rating = self.total_revealed_rating + cumulative_rating
        }
    }

    pub struct Vote {
        pub var poll_id: String
        pub var encrypted_vote: String
        pub var decrypted_vote: UInt8?

        init(poll_id: String, encrypted_vote: String) {
            self.poll_id = poll_id
            self.encrypted_vote = encrypted_vote
            self.decrypted_vote = nil
        }

        pub fun reveal_vote(decrypted_vote: UInt8) {
            self.decrypted_vote = decrypted_vote
        }
    }

    pub struct Stake {
        pub var poll_id: String
        pub var staked_amount: UInt64
        pub var range_begin: UInt8
        pub var range_end: UInt8

        init(poll_id: String, staked_amount: UInt64, range_begin: UInt8, range_end: UInt8) {
            self.poll_id = poll_id
            self.staked_amount = staked_amount
            self.range_begin = range_begin
            self.range_end = range_end
        }
    }

    access(contract) var polls: {String: Poll}
    access(contract) var content: {String: Content}
    access(contract) var votes: {Address: Vote}
    access(contract) var stakes: {Address: Stake}

    init() {
        self.polls = {}
        self.votes = {}
        self.stakes = {}
        self.content = {}
    }

    pub fun getPolls(): {String: Poll} {
        return self.polls
    }

    pub fun getVotes(): {Address: Vote} {
        return self.votes
    }

    pub fun getStakes(): {Address: Stake} {
        return self.stakes
    }

    pub fun addPoll(poll_id: String, voting_deadline: UInt64, max_options: UInt8, public_key: String) {
        self.polls[poll_id] = Poll(poll_id: poll_id, voting_deadline: voting_deadline, max_options: max_options, public_key: public_key)
    }

    pub fun addVote(account: AuthAccount, poll_id: String, encrypted_vote: String) {
        self.votes[account.address] = Vote(poll_id: poll_id, encrypted_vote: encrypted_vote)
        self.polls[poll_id]?.add_vote()
    }

    pub fun addStake(account: AuthAccount, poll_id: String, staked_amount: UInt64, range_begin: UInt8, range_end: UInt8) {
        self.stakes[account.address] = Stake(poll_id: poll_id, staked_amount: staked_amount, range_begin: range_begin, range_end: range_end)
    }

    pub fun addContent(content_id: String, title: String) {
        self.content[content_id] = Content(title: title)
    }

    pub fun cancelPoll(poll_id: String) {
        self.polls[poll_id]?.cancel_poll()
    }

    pub fun endPoll(poll_id: String) {
        self.polls[poll_id]?.end_poll()
    }

    pub fun revealPoll(poll_id: String, result: UInt8, secret_key: String) {
        self.polls[poll_id]?.reveal_poll(result: result, secret_key: secret_key)
    }

    pub fun update_cumulative_ratings(content_id: String, cumulative_rating: UInt64, votes_added: UInt32) {
        self.content[content_id]?.update_cumulative_ratings(cumulative_rating: cumulative_rating, votes_added: votes_added)
    }

    pub fun revealVote(account: AuthAccount, decrypted_vote: UInt8) {
        self.votes[account.address]?.reveal_vote(decrypted_vote: decrypted_vote)
    }
}