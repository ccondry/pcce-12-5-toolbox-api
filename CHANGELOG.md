# Change Log for pcce-12-5-toolbox-api 

Versions are semever-compatible dates in YYYY.MM.DD-X format,
where X is the revision number


# 2021.6.9

### Fixes
* **Provision:** Fix provision errors when VPN username is longer than 20
characters.


# 2021.4.12-1

### Features
* **Reset VPN Password:** Add route to reset VPN password.


# 2021.4.12

### Bug Fixes
* **Reprovision:** Update user VPN password when they reprovision.
* **Provision:** Retry CCE provision tasks on either 401 or 503 errors.


# 2021.4.9

### Features
* **Provision:** Allow admins using switch-user to provision a user from start
to finish, the same as the user would normally be able to do.


# 2020.11.15

### Bug Fixes
* **Demo Website:** fix verticals list not showing user's verticals


# 2020.10.26

### Features
* **Outbound Campaigns:** fix error message formatting when list campaigns fails


# 2020.10.22-3

### Features
* **SSO:** roll back changes to SSO and toolbox/VPN passwords


# 2020.10.22-2

### Features
* **Outbound Campaigns:** Add routes to manage outbound campaigns


# 2020.10.22-1

### Features
* **Provision:** Provision now resets LDAP password to C1sco12345


# 2020.10.22

### Features
* **Provision:** Provision now uses C1sco12345 password instead of user's
toolbox password, to migrate to Cisco SSO only for toolbox authentication.


# 2020.10.21

### Features
* **Provision:** Copy Finesse wrap-up reasons from CumulusMain team to user's 
main team


# 2020.10.9-3

### Features
* **Logging:** Reduce logging

### Bug Fixes
* **Provision:** Fix new call type provisioning


# 2020.10.9.2

### Features
* **Provision:** Retry CCE REST operations many times if they receive a 401 error
* **Logging:** Reduce logging


# 2020.10.9.1

### Features
* **Release:** QA release
