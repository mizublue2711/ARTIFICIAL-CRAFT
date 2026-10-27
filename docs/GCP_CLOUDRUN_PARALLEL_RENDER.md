# GCP Cloud Run Parallel Render Setup & Execution Guide

This document outlines the end-to-end instructions for setting up, deploying, and rendering high-performance 60fps automated Remotion promotional videos for Artificial Craft using GCP Cloud Run.

---

## 1. Service Account Setup & GCP Permissions

Create a dedicated Service Account named `remotion-sa` with required IAM permissions for Google Cloud Storage and GCP Cloud Run.

### Step 1: Create Service Account
```bash
gcloud iam service-accounts create remotion-sa \
    --description="Dedicated Service Account for Remotion Cloud Run Video Automation" \
    --display-name="Remotion Service Account"
```

### Step 2: Assign IAM Roles
Assign storage, invocation, and Cloud Run administration permissions:

```bash
# Cloud Run Developer / Admin permission
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
    --member="serviceAccount:remotion-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

# Cloud Run Invoker permission
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
    --member="serviceAccount:remotion-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.invoker"

# Storage Object Admin permission
gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
    --member="serviceAccount:remotion-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

### Step 3: Generate and Export Credentials Key
Generate a JSON key file and export `GOOGLE_APPLICATION_CREDENTIALS`:

```bash
gcloud iam service-accounts keys create ./gcp-key.json \
    --iam-account=remotion-sa@YOUR_GCP_PROJECT_ID.iam.gserviceaccount.com

export GOOGLE_APPLICATION_CREDENTIALS="./gcp-key.json"
```

---

## 2. Deploy Remotion Cloud Run Service

Deploy the rendering service to GCP Cloud Run and bind execution to `remotion-sa` to prevent authentication token 404 errors.

```bash
# Set GOOGLE_APPLICATION_CREDENTIALS before deployment
export GOOGLE_APPLICATION_CREDENTIALS="./gcp-key.json"

# Deploy service to Cloud Run bound to remotion-sa
npx remotion cloudrun services deploy
```

---

## 3. Parallel Rendering with Dynamic Input Props

Render dynamic video datasets directly using `npx remotion cloudrun render`.

### Example Render Command:
```bash
npx remotion cloudrun render <site-name> ArtificialCraftScene \
  --input-props='{
    "title": "ARTIFICIAL CRAFT AUTOMATION",
    "subtitle": "Where Meticulous Graphic Design Meets Deterministic AI Automation.",
    "mockupImageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
    "metrics": [
      { "label": "LATENCY", "value": "12ms" },
      { "label": "ACCURACY", "value": "99.9%" },
      { "label": "THROUGHPUT", "value": "10k req/s" }
    ],
    "ctaText": "LAUNCH STUDIO"
  }'
```

### Automated Batch Rendering Script Example:
```javascript
import { renderMediaOnCloudRun } from '@remotion/cloudrun/client';

async function triggerParallelVideoRender(payload) {
  const { renderId, bucketName } = await renderMediaOnCloudRun({
    serviceName: 'remotion-render-service',
    region: 'us-central1',
    composition: 'ArtificialCraftScene',
    inputProps: payload,
    codec: 'h264',
  });

  console.log(`Render started successfully. Render ID: ${renderId}`);
  return { renderId, bucketName };
}
```
