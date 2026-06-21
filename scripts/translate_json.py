#!/usr/bin/env python3
"""Translate the English Quarter JSON to Spanish."""

import json
import sys
from pathlib import Path

INPUT = Path("src/data/quarters/2026-q3-en.json")
OUTPUT = Path("src/data/quarters/2026-q3.json")

LESSON_TITLES = {
    "Paul\u2019s Ministry in Corinth": "El Ministerio de Pablo en Corinto",
    "The Message of the Cross": "El Mensaje de la Cruz",
    "Unity in Christ": "Unidad en Cristo",
    "Sin in the Church": "El Pecado en la Iglesia",
    "All to the Glory of God": "Todo para la Gloria de Dios",
    "Spiritual Gifts": "Dones Espirituales",
    "A Portrait of Love": "Un Retrato del Amor",
    "The Power of Christ\u2019s Resurrection": "El Poder de la Resurrección de Cristo",
    "Love-driven Ministry": "Un Ministerio Motivado por el Amor",
    "Authentic Christian Ministry": "Auténtico Ministerio Cristiano",
    "Stewardship and Mission": "Mayordomía y Misión",
    "Dealing With False Teachers": "Enfrentando a los Falsos Maestros",
    "Grace, Love, and Fellowship": "Gracia, Amor y Comunión",
}
