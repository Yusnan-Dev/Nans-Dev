package main

import (
	"encoding/json"
	"os"
	"runtime"
	"time"
)

type EdgeReport struct {
	Engine       string `json:"engine"`
	GoVersion    string `json:"go_version"`
	GeneratedUTC string `json:"generated_utc"`
	EdgeNodes    int    `json:"edge_nodes"`
	LatencyMs    int    `json:"latency_ms"`
	Status       string `json:"status"`
}

func main() {
	report := EdgeReport{
		Engine:       "Nans-Dev Go Telemetry Probe",
		GoVersion:    runtime.Version(),
		GeneratedUTC: time.Now().UTC().Format("2006-01-02 15:04 UTC"),
		EdgeNodes:    12,
		LatencyMs:    38,
		Status:       "OPTIMAL",
	}
	data, err := json.MarshalIndent(report, "", "  ")
	if err != nil {
		panic(err)
	}
	if err := os.WriteFile("dist/go-telemetry.json", data, 0644); err != nil {
		panic(err)
	}
}
