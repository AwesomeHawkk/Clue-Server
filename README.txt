1. Everything works for my Clue game ported to a nodejs server and a ajax except for the following:

A. It is not multi-thread, so multiple players cannot play at the same time.

B. The computer guesses can be repeated. This bug was in my original submission of the code for the assignment. This will sometimes cause a “ -No new valid guess was made.-” response to the cars shown from the computer. This is because I have code to account for this.



2. I left some debug text in the bottom to help you test my program. For example, I tell you what the winning 3 cards are, so you can test that easier.