FROM --platform=linux/amd64 ldapaccountmanager/lam

RUN echo "Mutex posixsem" >> /etc/apache2/apache2.conf