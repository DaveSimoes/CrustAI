# 🦀 CrustAI — Model Benchmark

Compare response time, throughput, and quality across local Ollama models — directly from your terminal.

---

## 🚀 Quick Start

```bash
# Pull the models you want to compare
ollama pull tinyllama
ollama pull llama3.2
ollama pull qwen2.5

# Run the benchmark (default: tinyllama, llama3.2, qwen2.5 — 3 runs each)
node scripts/benchmark.js
```

---

## ⚙️ Options

| Flag | Default | Description |
|------|---------|-------------|
| `--models` | `tinyllama,llama3.2,qwen2.5` | Comma-separated list of models to benchmark |
| `--runs` | `3` | Number of runs per prompt (results are averaged) |
| `--url` | `http://localhost:11434` | Ollama API base URL |
| `--save` | off | Save full JSON report to disk |

### Examples

```bash
# Benchmark only two models
node scripts/benchmark.js --models tinyllama,llama3.2

# 5 runs for more stable averages
node scripts/benchmark.js --runs 5

# Custom Ollama URL + save JSON report
node scripts/benchmark.js --url http://192.168.1.10:11434 --save

# All options combined
node scripts/benchmark.js --models tinyllama,qwen2.5 --runs 5 --save
```

---

## 📊 What It Measures

Each model is tested across **5 prompt categories**:

| Category | Description |
|----------|-------------|
| 👋 Basic | Simple greeting — raw speed |
| 🧠 Reasoning | Two-sentence knowledge question |
| 💻 Coding | JavaScript function generation |
| 🌐 Multilingual | Portuguese response (PT-BR) |
| 📝 Summarization | Text summarization task |

**Metrics collected per prompt:**

- **Avg Total Time (ms)** — wall-clock time from request to last token
- **First Token (ms)** — time to first token (latency perception)
- **Tokens/sec** — throughput from Ollama's `eval_duration`
- **Output tokens** — response length
- **Success rate** — % of runs that completed without error

---

## 📈 Sample Output

```
🦀 CrustAI Model Benchmark
Ollama: http://localhost:11434  |  Models: tinyllama, llama3.2, qwen2.5  |  Runs: 3

📊 Summary Table
──────────────────────────────────────────────────────────────────────
Model                Avg Time    First Token   Tokens/s    Success
──────────────────────────────────────────────────────────────────────
tinyllama              1823ms         312ms     38.4 t/s       100%
llama3.2               4201ms         891ms     22.1 t/s       100%
qwen2.5                5644ms        1102ms     18.7 t/s       100%

⚡ Speed Comparison (lower = faster)
tinyllama      ██████████░░░░░░░░░░░░░░░░░░░░ 1823ms
llama3.2       ████████████████████░░░░░░░░░░ 4201ms
qwen2.5        ██████████████████████████████ 5644ms

🏆 Results:
  Fastest response:  tinyllama  (1823ms avg)
  Best throughput:   tinyllama  (38.4 tokens/sec)
```

> ⚠️ Results vary by hardware. Run on your own machine for accurate numbers.

---

## 💾 JSON Export

Use `--save` to export the full report:

```bash
node scripts/benchmark.js --save
# → benchmark-2026-05-22T10-30-00-000Z.json
```

The JSON includes per-model, per-prompt raw data suitable for further analysis or visualization.

---

## 🛠️ Requirements

- Node.js ≥ 20.0
- Ollama running locally (`ollama serve`)
- At least one model pulled (`ollama pull tinyllama`)

---

*Made with 🦀 and ❤️ by [Dave Simoes](https://github.com/DaveSimoes)*
