# Generated by Django 5.0.6 on 2024-08-01 06:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_post_image_post_video'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='thumbnail',
            field=models.ImageField(blank=True, default='thumbnails/blank.svg', null=True, upload_to='thumbnails/'),
        ),
    ]
