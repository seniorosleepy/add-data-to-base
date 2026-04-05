package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/lib/pq"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type Answer struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

var db *sql.DB

func withCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func chekUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var a Answer

	if err := json.NewDecoder(r.Body).Decode(&a); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	var exists bool

	err := db.QueryRow(
		"SELECT EXISTS(SELECT 1 FROM accounts WHERE email = $1 AND password = $2)",
		a.Email, a.Password,
	).Scan(&exists)

	if err != nil {
		http.Error(w, "database error", 500)
		return
	}

	if exists {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("User exist"))
	} else {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
	}

}

func createUser(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var u User
	if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
		http.Error(w, "invalid JSON", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("INSERT INTO accounts (username, password, email) VALUES ($1, $2, $3)", u.Username, u.Password, u.Email)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write([]byte("user created"))
}

func main() {
	var err error
	connStr := "postgres://postgres:nik7142009@localhost:5432/mydb?sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS accounts (
		id SERIAL PRIMARY KEY,
		username TEXT,
		password TEXT,
		email TEXT
	)`)
	if err != nil {
		log.Fatal(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/create", createUser)
	mux.HandleFunc("/check", chekUser)

	// Оборачиваем весь mux в CORS middleware
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", withCors(mux)))
}
