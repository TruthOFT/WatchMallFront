<template>
  <footer class="app-footer">
    <div class="footer-content">
      <a-row :gutter="[40, 40]">
        <a-col :xs="24" :md="8">
          <h3 class="footer-logo">PawConnect</h3>
          <p>Connecting pets with loving homes since 2024.</p>
        </a-col>
        <a-col :xs="12" :md="8">
          <h4>Links</h4>
          <ul class="footer-links">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Adopt</a></li>
            <li><a href="#">Volunteer</a></li>
            <li><a href="#">Donate</a></li>
          </ul>
        </a-col>
        <a-col :xs="12" :md="8">
          <h4>Contact</h4>
          <p>hello@pawconnect.com</p>
          <p>1-800-PAW-LOVE</p>
        </a-col>
      </a-row>
      <div class="footer-bottom">
        &copy; 2026 PawConnect. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #431407; /* Very dark brown */
  color: #fed7aa;
  padding: 60px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-logo {
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #fed7aa;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: white;
}

h4 {
  color: white;
  margin-bottom: 20px;
}

.footer-bottom {
  margin-top: 60px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  font-size: 0.875rem;
  opacity: 0.7;
}
</style>
