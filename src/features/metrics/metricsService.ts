import metrics from "../../utils/Metrics";

const getMetrics = async function () {
    return metrics.getMetrics();
}

export default { getMetrics };