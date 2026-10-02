---
"@solidaris-danielbodigil/pds-ui": patch
---

Fix keyboard focus in four components. Input Clear hands focus back to its field after a keyboard clear instead of leaving it on the hidden button. Top Nav returns focus to the search toggle when Escape closes the search, without reopening it. List moves focus to the first option when its target picker opens from the keyboard, and back to the tag when it closes. Transactions CICS Modal returns focus to the element that opened it.
