from django.db import models
from userprofile.models import profile

# Create your models here.



class SkillCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class skill(models.Model):
    name=models.CharField(max_length=100,unique=True)
    category=models.ForeignKey(SkillCategory,on_delete=models.CASCADE,null=True,blank=True)
    def __str__(self):
        return self.name
    
class skill_wanted(models.Model):
    user=models.ForeignKey(profile, on_delete=models.CASCADE,related_name='skillwanted')
    name=models.ForeignKey(skill,on_delete=models.CASCADE)
   

    created_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name.name

class  skilloffered(models.Model):
    user=models.ForeignKey(profile,on_delete=models.CASCADE)
    skills=models.ForeignKey(skill,on_delete=models.CASCADE)
    experience_level = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.user.username} offers {self.skills.name}"
    
       

    
