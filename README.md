What's Next

This app help's users find the next book to put on their bookshelf, using the TasteKid and Google Books API's.

This application makes use of the following api's and technologies:
Google Books Api
TasteKid Api
HTML
CSS
JavaScript
jQuery

The application functionality allows a user to input the last book they read and returns suggestions for other books they may enjoy reading next.

User Flow:
1. Input last book a user has read
2. Ajax call to tastekid api to retrieve similar titles
3. Using those similar titles, there is an ajax call to the google books api to
populate the webpage with information about those 'similar titles'
4. User can then search through given results to decide on a future book purchase
5. A link is provided to connect to Google Books, where a user can see reviews and purchase the book.
