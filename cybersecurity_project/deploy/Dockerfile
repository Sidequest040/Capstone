# Use the official Jenkins image as a parent image
FROM jenkins/jenkins:lts

# Set environment variables for Jenkins
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

# Expose port 8080 for the web interface and 50000 for JNLP agents
EXPOSE 8080 50000

# Automatically install suggested plugins
RUN jenkins-plugin-cli --plugins

