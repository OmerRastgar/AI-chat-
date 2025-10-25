| | |
|:---|:---|
| **Policy Number** | [PO-XXX-001] |
| **Policy Owner** | [e.g., Head of HR, CISO, Legal Counsel] |
| **Approved By** | [e.g., CEO, Board of Directors] |
| **Effective Date** | 2025-10-25 |
| **Last Review Date** | 2025-10-25 |

Acceptable Encryption Standard

# Acceptable Encryption Standard

## (Last Updated April 2025)

# Purpose

The purpose of this policy is to provide guidance that limits the use of encryption to those algorithms that have received substantial public review and have been proven to work effectively. Additionally, this policy provides direction to ensure that Federal regulations are followed, and legal authority is granted for the dissemination and use of encryption technologies outside of the United States.

# Scope

This policy applies to all <Company Name> employees and affiliates.

# Safeguards

# Algorithm Requirements

Ciphers in use must meet or exceed the set defined as "AES-compatible" or "partially AES-compatible" according to the IETF/IRTF Cipher Catalog, or the set defined for use in the United States National Institute of Standards and Technology (NIST) publication FIPS 140-2, or any superseding documents according to the date of implementation. The use of the Advanced Encryption Standard (AES) is strongly recommended for symmetric encryption. Algorithms in use must meet the standards defined for use in NIST publication FIPS 140-2 or any superseding document, according to date of implementation. The use of the RSA and Elliptic Curve Cryptography (ECC) algorithms is strongly recommended for asymmetric encryption.

# Signature Algorithms

Algorithm Key Length Additional Comment (min) ECDSA P-256 Consider RFC6090 to avoid patent infringement. RSA 2048 Must use a secure padding scheme. PKCS#7 padding scheme is recommended. Message hashing required. LDWM SHA256 Refer to LDWM Hash-based Signatures

# Draft

# Hash Function Requirements

In general, <Company Name> adheres to the NIST Policy on Hash Functions. Key Agreement and Authentication Key exchanges must use one of the following cryptographic protocols: Diffie-Hellman, IKE, or Elliptic curve Diffie-Hellman (ECDH). End points must be authenticated prior to the exchange or derivation of session keys. Public keys used to establish trust must be authenticated prior to use. Examples of authentication include transmission via cryptographically signed message or manual verification of the public key hash. All servers used for authentication (for example, RADIUS or TACACS) must have installed a valid certificate signed by a known trusted provider. All servers and applications using SSL or TLS must have the certificates signed by a known, trusted provider.

# Key Generation

Cryptographic keys must be generated and stored in a secure manner that prevents loss, theft, or compromise. Key generation must be seeded from an industry standard random number generator (RNG). For examples, see NIST Annex C: Approved Random Number Generators for FIPS PUB 140-2.

# Policy Sanctions

Non-compliance with this policy may result in disciplinary action in line with our corporation's human resources procedures. Consequences may range from mandatory refresher training and written warnings to temporary suspension of remote access privileges and, in severe cases, termination of employment or contractual obligations. Individuals could be subject to legal consequences under applicable laws if violations involve illegal activities. These sanctions emphasize the critical importance of cybersecurity, the individual's role in protecting our digital assets, and the potential risks associated with policy violations. Enforcement will be consistent and impartial, with the severity of the action corresponding directly to the seriousness of the breach.

## Responsibilities

## Definitions

## References

## Revision History (for this Markdown document)

Maintain a log of changes made to *this* document.

| Version | Date | Author | Summary of Changes |
|:---|:---|:---|:---|
| 1.0 | 2025-10-25 | [Author's Name] | Initial import from PDF. |
| | | | |