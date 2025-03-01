// Task 1: Function to process book data
function processBookData(books) {
    if (!Array.isArray(books)) {
        throw new Error("Invalid input: Expected an array of books.");
    }

    const booksAfter2000 = books.filter(book => book.year > 2000);
    const authors = [...new Set(books.map(book => book.author))].sort();
    const genreCount = books.reduce((acc, book) => {
        acc[book.genre] = (acc[book.genre] || 0) + 1;
        return acc;
    }, {});

    return {
        booksAfter2000,
        sortedAuthors: authors,
        genreCount
    };
}

// Task 2: Library Class
class Library {
    constructor(initialBooks = [], initialCategories = []) {
        this.books = [];
        this.booksAfter2000 = [];
        this.genreCounts = {};
        this.categories = initialCategories;
        initialBooks.forEach(book => this.addBook(book));
    }

    addBook(book, categoryPath = "") {
        if (!book || typeof book !== 'object') {
            throw new Error("Invalid book entry: Expected an object.");
        }
        const { title, author, year, genre } = book;
        if (!title || !author || typeof year !== 'number' || !genre) {
            throw new Error("Invalid book entry: title, author, year (number), and genre are required.");
        }
        this.books.push(book);
        if (year > 2000) {
            this.booksAfter2000.push(book);
        }
        this.genreCounts[genre] = (this.genreCounts[genre] || 0) + 1;

        // Add book to the specified category
        const category = this.findOrCreateCategory(categoryPath);
        if (!category.books) {
            category.books = [];
        }
        category.books.push(book);
    }

    removeBook(title) {
        const index = this.books.findIndex(book => book.title === title);
        if (index === -1) {
            throw new Error(`Book with title "${title}" not found.`);
        }
        const [removedBook] = this.books.splice(index, 1);
        this.booksAfter2000 = this.booksAfter2000.filter(book => book.title !== title);
        this.genreCounts[removedBook.genre]--;
        if (this.genreCounts[removedBook.genre] === 0) {
            delete this.genreCounts[removedBook.genre];
        }

        // Remove book from the category
        this.removeBookFromCategory(title, this.categories);
    }

    removeBookFromCategory(title, category) {
        if (category.books) {
            category.books = category.books.filter(book => book.title !== title);
        }
        if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
                this.removeBookFromCategory(title, subcategory);
            });
        }
    }

    getBooksByAuthor(author) {
        return this.books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    }

    searchBooks({ year, genre, author, title } = {}) {
        return this.books.filter(book => 
            (year ? book.year === year || (Array.isArray(year) && book.year >= year[0] && book.year <= year[1]) : true) &&
            (genre ? book.genre.toLowerCase().includes(genre.toLowerCase()) : true) &&
            (author ? book.author.toLowerCase().includes(author.toLowerCase()) : true) &&
            (title ? book.title.toLowerCase().includes(title.toLowerCase()) : true)
        );
    }

    getBooksAfter2000() {
        return this.booksAfter2000;
    }

    getGenreCounts() {
        return this.genreCounts;
    }

    static createFromJSON(jsonString) {
        try {
            const parsedBooks = JSON.parse(jsonString);
            if (!Array.isArray(parsedBooks)) {
                throw new Error("Invalid JSON format: Expected an array of books.");
            }
            const processedData = processBookData(parsedBooks);
            const library = new Library(parsedBooks);
            library.booksAfter2000 = processedData.booksAfter2000;
            library.genreCounts = processedData.genreCount;
            return library;
        } catch (error) {
            throw new Error("Error parsing JSON: " + error.message);
        }
    }

    sortBooksBy(field, ascending = true) {
        const validFields = ["title", "author", "year", "genre"];
        if (!validFields.includes(field)) {
            throw new Error("Invalid sort field. Choose from: title, author, year, genre.");
        }
        return [...this.books].sort((a, b) => {
            if (a[field] < b[field]) return ascending ? -1 : 1;
            if (a[field] > b[field]) return ascending ? 1 : -1;
            return 0;
        });
    }

    // Task 3: Method to get all book paths
    getAllBookPaths(category = this.categories, path = "", visited = new Set()) {
        let paths = [];
        if (visited.has(category)) {
            throw new Error("Infinite loop detected: A subcategory references itself.");
        }
        visited.add(category);

        if (category.books) {
            paths = paths.concat(category.books.map(book => `${path}/${book.title}`));
        }
        if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
                paths = paths.concat(this.getAllBookPaths(subcategory, `${path}/${subcategory.name}`, visited));
            });
        }
        visited.delete(category);
        return paths;
    }

    // Helper method to find or create a category based on the given path
    findOrCreateCategory(path) {
        if (!path) return this.categories;
        const parts = path.split('/');
        let currentCategory = this.categories;
        parts.forEach(part => {
            if (!currentCategory.subcategories) {
                currentCategory.subcategories = [];
            }
            let subcategory = currentCategory.subcategories.find(sub => sub.name === part);
            if (!subcategory) {
                subcategory = { name: part, books: [], subcategories: [] };
                currentCategory.subcategories.push(subcategory);
            }
            currentCategory = subcategory;
        });
        return currentCategory;
    }
}

// Task 4: Custom map, filter, and reduce functions

// Custom map function
function myMap(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i, array));
    }
    return result;
}

// Custom filter function
function myFilter(array, callback) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

// Custom reduce function
function myReduce(array, callback, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < array.length; i++) {
        accumulator = callback(accumulator, array[i], i, array);
    }
    return accumulator;
}

// Example Usage
const books = [
    { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
    { title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
    { title: "The Road", author: "Cormac McCarthy", year: 2006, genre: "Post-Apocalyptic" },
    { title: "The Martian", author: "Andy Weir", year: 2011, genre: "Sci-Fi" },
    { title: "Dune", author: "Frank Herbert", year: 1965, genre: "Sci-Fi" },
    { title: "Brave New World", author: "Aldous Huxley", year: 1932, genre: "Dystopian" },
    { title: "Fahrenheit 451", author: "Ray Bradbury", year: 1953, genre: "Dystopian" },
    { title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" },
    { title: "Moby-Dick", author: "Herman Melville", year: 1851, genre: "Adventure" }
];

const categories = {
    name: "Fiction",
    books: [{ title: "The Hobbit" }],
    subcategories: [
        {
            name: "Sci-Fi",
            books: [{ title: "Dune" }],
            subcategories: [
                {
                    name: "Dystopian",
                    books: [{ title: "1984" }],
                    subcategories: []
                }
            ]
        }
    ]
};

const library = new Library(books, categories);

// Change search parameters easily
const searchParams = { genre: "Dystopian" };
console.log(library.searchBooks(searchParams));

console.log(library.getBooksByAuthor("J.R.R. Tolkien"));
console.log(library.getBooksAfter2000());
console.log(library.getGenreCounts());
console.log(library.getAllBookPaths());

// Adding a new book to a specific category
library.addBook({ title: "Neuromancer", author: "William Gibson", year: 1984, genre: "Sci-Fi" }, "Fiction/Sci-Fi");
console.log(library.getAllBookPaths());

// Using custom map to get all authors
const authors = myMap(books, book => book.author);
console.log("Authors:", authors);

// Using custom filter to get books published after 2000
const booksAfter2000 = myFilter(books, book => book.year > 2000);
console.log("Books after 2000:", booksAfter2000);

// Using custom reduce to count genres
const genreCount = myReduce(books, (acc, book) => {
    acc[book.genre] = (acc[book.genre] || 0) + 1;
    return acc;
}, {});
console.log("Genre count:", genreCount);
