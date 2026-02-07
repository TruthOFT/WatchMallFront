<template>
  <div class="page-container">
    <div class="container">
      <div class="page-header">
        <h1>Concierge Support</h1>
        <p>We are at your service.</p>
      </div>

      <div class="support-grid">
        <div class="contact-info liquid-glass">
          <h3>Get in Touch</h3>
          <p>Our dedicated concierge team is available 24/7 to assist with your inquiries.</p>
          
          <div class="info-item">
            <span class="label">Client Services</span>
            <span class="value">+1 (888) 123-4567</span>
          </div>
          
          <div class="info-item">
            <span class="label">Email</span>
            <span class="value">concierge@watchmall.com</span>
          </div>

          <div class="info-item">
            <span class="label">Boutique</span>
            <span class="value">123 Luxury Ave, New York, NY 10001</span>
          </div>
        </div>

        <div class="contact-form-container">
          <div class="glass-panel form-panel">
            <h3>Send a Message</h3>
            <a-form layout="vertical">
              <a-form-item label="Name">
                <a-input size="large" />
              </a-form-item>
              <a-form-item label="Email">
                <a-input size="large" />
              </a-form-item>
              <a-form-item label="Subject">
                <a-select size="large">
                  <a-select-option value="inquiry">Product Inquiry</a-select-option>
                  <a-select-option value="service">Service Request</a-select-option>
                  <a-select-option value="appointment">Book Appointment</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="Message">
                <a-textarea :rows="4" />
              </a-form-item>
              <a-button type="primary" size="large" block>SEND MESSAGE</a-button>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 120px 0 80px;
  background-color: var(--color-bg-main);
  min-height: 80vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
}

.page-header p {
  color: var(--color-secondary);
  font-size: 1.2rem;
  font-family: var(--font-heading);
}

.support-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 60px;
}

.contact-info {
  padding: 40px;
  height: fit-content;
}

.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 24px;
}

.contact-info p {
  margin-bottom: 32px;
  line-height: 1.6;
  color: var(--color-secondary);
}

.info-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-cta);
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.info-item .value {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  color: var(--color-primary);
}

.form-panel {
  padding: 40px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.05);
}

.form-panel h3 {
  margin-bottom: 24px;
}

@media (max-width: 768px) {
  .support-grid {
    grid-template-columns: 1fr;
  }
}
</style>
