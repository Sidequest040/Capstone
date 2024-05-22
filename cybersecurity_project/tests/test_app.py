import unittest
from src.app import app

class FlaskTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        result = self.app.get('/')
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.data, b'Hello, World!')

    def test_detect(self):
        result = self.app.post('/detect', json={'test': 'data'})
        self.assertEqual(result.status_code, 200)
        self.assertIn(b'success', result.data)

if __name__ == '__main__':
    unittest.main()
