# NBA Players API

A RESTful API service that provides comprehensive information about NBA players, including their personal details, draft information, and player images.

## Features

- 🏀 Comprehensive NBA player data
- 📷 Player images
- 🔍 Advanced search capabilities
- 📊 Pagination support
- 🔄 Flexible sorting options
- 📚 Swagger/OpenAPI documentation

## Tech Stack

### Backend Framework

- **Node.js** - JavaScript runtime environment (v14+)
- **Express.js** - Fast, unopinionated web framework for Node.js
- **SQLite** - Lightweight, serverless database perfect for development
- **Prisma ORM** - Modern database toolkit for Node.js & TypeScript
- **Swagger/OpenAPI** - API documentation
- **Winston Logger** - Versatile logging library
- **Nodemon** - Auto-reloads server during development

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Sovitou/nba-player-api.git
cd nba-player-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
npx prisma migrate dev
npm run load-csv
```

## Usage

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:4000`

View API documentation:
`http://localhost:4000/api/docs`
in your browser to see the Swagger documentation.

## API Endpoints

### Get Players List

```http
GET /api/players
```

Query Parameters:

- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `search` (optional)
- `sortBy` (default: "lastName")
- `sortOrder` (default: "asc")

### Get Player by ID

```http
GET /api/players/{id}
```

### Get Player Image

```http
GET /api/players/{id}/image
```

## Project Structure

```
nba-player-api/
├── data/                          # Data sources
│   └── players.csv               # NBA players dataset
├── docs/                         # Documentation
│   └── swagger.yaml             # OpenAPI/Swagger specification
├── img/                         # Static assets
│   └── *.png                   # Player profile images
├── logs/                       # Application logs
│   ├── error.log              # Error level logs
│   └── combined.log          # All level logs
├── prisma/                    # Database configuration
│   ├── schema.prisma         # Prisma schema
│   └── database.sqlite     # SQLite database file
├── scripts/                 # Utility scripts
│   └── load-csv.js        # Data import utility
├── src/                   # Application source code
│   ├── controllers/      # Request handlers
│   │   ├── searchPlayerFiltering.js    # Search & filter logic
│   │   ├── getPlayerById.js           # Single player retrieval
│   │   └── getPlayerImage.js         # Player image handling
│   ├── middleware/               # Express middleware
│   │   ├── validation.js       # Request validation
│   ├── routes/               # API routes
│   │   └── players.js      # Player endpoints
│   └── utils/             # Utility functions
│       └── logger.js     # Logging configuration
├── .env                 # Environment variables
├── .gitignore         # Git ignore rules
├── package.json      # Project dependencies and scripts
└── README.md       # Project documentation
```

## Data Sources

The player data includes:

- Player ID
- First and Last Name
- Position
- Height and Weight
- Birthday
- Country
- School
- Draft Information

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run load-csv`: Import player data from CSV

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT= 4000
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NBA player data source
- Contributors and maintainers
- Open source community
