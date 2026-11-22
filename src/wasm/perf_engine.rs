#[no_mangle]
pub extern "C" fn compute_eased_score(progress_pct: i32, target_score: i32) -> i32 {
    let p = (progress_pct.clamp(0, 100) as f64) / 100.0;
    let eased = 1.0 - (1.0 - p).powi(3);
    let val = 45.0 + ((target_score - 45) as f64) * eased;
    val.round() as i32
}

#[no_mangle]
pub extern "C" fn compute_edge_latency_ms(base_ms: i32, node_count: i32) -> i32 {
    let nodes = node_count.max(1);
    let optimized = (base_ms as f64) / (1.0 + (nodes as f64) * 0.18);
    optimized.round() as i32
}

#[no_mangle]
pub extern "C" fn compute_monthly_leads(daily_visitors: i32, uplift_pct: i32) -> i32 {
    let v = daily_visitors.max(0) as f64;
    let rate = (uplift_pct.clamp(1, 50) as f64) / 100.0;
    (v * 30.0 * rate).round() as i32
}
